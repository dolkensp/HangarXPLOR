var HangarXPLOR = window.HangarXPLOR || {};
HangarXPLOR.Billing =  window.HangarXPLOR.Billing || {};

HangarXPLOR.Billing.Keys = [];
HangarXPLOR.Billing.Bills = [];
HangarXPLOR.Billing.DoneLoading = false;

HangarXPLOR.Billing.LoadData = function() {
    HangarXPLOR.Billing.parseBills(1);
};

HangarXPLOR.Billing.getBill = function(name, date, isUpgraded = false, upgradedName = null) {
    const bills = HangarXPLOR.Billing.Bills[HangarXPLOR.Billing.parseDate(date)];

    if(typeof bills === 'undefined') {
        return [null];
    }

    let bill = null;
    // --- find bill
    for(let i = 0; i < bills.length; i++) {
        if(bills[i]['name'].includes(name.toLowerCase())) {
            bill = bills[i];
        }
    }

    if(bill === null) {
        let fuse = new Fuse(bills, {keys: ['name']})
        let results = fuse.search(name);

        if(results.length > 0) {
            bill = results[0];
        }
    }

    // --- if this item was upgraded then also try to find the bill for the upgrade
    if(bill !== null && isUpgraded) {
        let upgraded_bill = null;
        let processing = false;

        for(let i in HangarXPLOR.Billing.Keys) {
            let key = HangarXPLOR.Billing.Keys[i];
            if(processing) {
                upgraded_bill = this.getBill(upgradedName, key)[0];
                if(upgraded_bill !== null) {
                    break;
                }
            } 
            // --- only start looking into the bills once we are past the billing date of the orginal item
            else if(key === bill.date) {
                processing = true;
            }
        }

        if(upgraded_bill !== null) {
            return [bill, upgraded_bill];
        }
    }

    return [bill];
}

HangarXPLOR.Billing.parseDate = function(date) {
    date = new Date(date);
    date.setHours(0);
    date.setMinutes(0);

    return date.toISOString().split('T')[0];
}

HangarXPLOR.Billing.parseBills = function(pageNo) {
    let page_size = 100; // <-- 100 is probably max 
    var request = new XMLHttpRequest();
    request.open('GET', 'https://robertsspaceindustries.com/account/billing?page=' + pageNo + '&pagesize=' + page_size + '&order_status=O,C  ', true); 
    request.onload = function() {
        if (request.readyState === 4 && request.status === 200) {
            // --- parse html & get the list of orders on that site
            var doc = new DOMParser().parseFromString(request.responseText, "text/html");
            let order_items = doc.getElementsByClassName('orders-item')[0].children;
            
            // --- go through each order and extract the name and the slug
            for(let i = 0; i < order_items.length; i++) {

                let order_name = order_items[i].getElementsByClassName('billing-summary')[0].children[0].children[1].children[0].firstChild.nodeValue;
                let order_slug = order_items[i].querySelector('[data-order-slug]');
                let order_date = HangarXPLOR.Billing.parseDate( new Date(order_items[i].getElementsByClassName('col date')[0].lastChild.data.trim()));
                
                if(HangarXPLOR.Billing.Keys.length === 0 || HangarXPLOR.Billing.Keys[HangarXPLOR.Billing.Keys.length - 1] !== order_date) {
                    HangarXPLOR.Billing.Keys.push(order_date);
                }


                // --- if the order slug is null then no invoice exists (e.g. cancelled, payment failed, etc.)
                if(order_slug !== null) {
                    order_slug = order_slug.dataset.orderSlug;
                    
                    if(!(order_date in HangarXPLOR.Billing.Bills)) {
                        HangarXPLOR.Billing.Bills[order_date] = [];
                    }  
                    
                    HangarXPLOR.Billing.Bills[order_date].push({
                        'name': order_name.toLowerCase(),
                        'slug': order_slug,
                        'date': order_date,
                    });
                }
            }

            if(order_items.length == page_size) {
                HangarXPLOR.Billing.parseBills(pageNo + 1);
            } else {
                HangarXPLOR.Billing.Keys.reverse();
                HangarXPLOR.Billing.DoneLoading = true;
            }
        }
    }
    request.send();
}
