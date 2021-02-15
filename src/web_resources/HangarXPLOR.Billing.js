var HangarXPLOR = window.HangarXPLOR || {};
HangarXPLOR.Billing =  window.HangarXPLOR.Billing || {};

HangarXPLOR.Billing.Bills = [];
HangarXPLOR.Billing.DoneLoading = false;

HangarXPLOR.Billing.LoadData = function() {
    HangarXPLOR.Billing.parseBills(1);
};

HangarXPLOR.Billing.getBill = function(name, element) {
    let date = element.getElementsByClassName('date-col')[0].lastChild.data.trim();
    const bills = HangarXPLOR.Billing.Bills[HangarXPLOR.Billing.parseDate(date)];

    if(typeof bills === 'undefined') {
        return null;
    }

    if(bills.length == 1) {
        return bills[0];
    } else if(bills.length > 1) {
        for(let i = 0; i < bills.length; i++) {
            if(bills[i]['name'].includes(name.toLowerCase())) {
                return bills[i];
            }
        }
    }

    return null;
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
                
                // --- if the order slug is null then no voice exists (e.g. cancelled, payment failed, etc.)
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
                HangarXPLOR.Billing.DoneLoading = true;
            }
        }
    }
    request.send();
}
