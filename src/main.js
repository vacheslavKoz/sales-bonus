/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {

 const { discount, sale_price, quantity } = purchase;
 return  sale_price * quantity * (1 - discount / 100);
}

function calculateProfit(item, product) {

 return item.sale_price * item.quantity * (1 - item.discount / 100) - product.purchase_price * item.quantity;

}


   // @TODO: Расчет выручки от операции

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    if ( index === 0) { return 0.15*seller.profit; }
if (index === 1 || index === 2) { return 0.1*seller.profit;}
if (index > 2 && index <= total -2 ) { return 0.05*seller.profit;}
return 0;

}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
if (!data
    || !Array.isArray(data.sellers)
    || data.sellers.length === 0
) {
    throw new Error('Некорректные входные данные');
}
    // @TODO: Проверка входных данных
 const { calculateRevenue, calculateBonus } = options;

if (!calculateRevenue|| !calculateBonus) {
    throw new Error('Чего-то не хватает');
}
    // @TODO: Проверка наличия опций

const sellerStats = data.sellers.map(seller => ({
   // Заполним начальными данными
        id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0,
        profit: 0,
        sales_count: 0,
    products_sold: {}
}));

const sellerIndex = sellerStats.reduce((result, item) => {
   
result[item.id] = item;
return result;
}, {});

const productIndex =  data.products.reduce((result, item) => {
   
result[item.sku] = item;
return result;
}, {});


data.purchase_records.forEach(record => { // Чек 
        const seller = sellerIndex[record.seller_id]; // Продавец
        // Увеличить количество продаж 
           seller.sales_count +=1;
         //  seller.revenue += record.total_amount;
        // Увеличить общую сумму выручки всех продаж
            
        // Расчёт прибыли для каждого товара
        record.items.forEach(item => {
            const product = productIndex[item.sku]; // Товар
            if (!product) return;
            // Посчитать себестоимость (cost) товара как product.purchase_price, умноженную на количество товаров из чека

            // const cost = product.purchase_price*item.quantity;
            const revenue = calculateRevenue(item, product);
            // Посчитать выручку (revenue) с учётом скидки через функцию calculateRevenue
            // Посчитать прибыль: выручка минус себестоимость
             const profit = calculateProfit(item, product);
        // Увеличить общую накопленную прибыль (profit) у продавца  
              seller.revenue+=revenue;
              seller.profit += profit;
            // Учёт количества проданных товаров
            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }
              seller.products_sold[item.sku] += item.quantity;
             
            // По артикулу товара увеличить его проданное количество у продавца
        });
 });



  sellerStats.sort(function compareFn(a, b) {
  if (a.profit < b.profit) {
    return 1
  } else if (a.profit > b.profit) {
    return -1
  }
  return 0
}); 

sellerStats.forEach((seller, index) => {
        seller.bonus = calculateBonus(index, sellerStats.length, seller);
        seller.top_products = Object.entries(seller.products_sold).sort((a,b) => b[1]-a[1] ).slice(0,10).reduce((acc,value,currentIndex) => {acc.push({});
acc[currentIndex].sku = value[0];
acc[currentIndex].quantity = value[1];
return acc },[]);
});

return sellerStats.map(seller => ({
        seller_id: seller.id,
        name: seller.name,
        revenue: Number(seller.revenue.toFixed(2)),
        profit: Number(seller.profit.toFixed(2)),
        sales_count: seller.sales_count,
        top_products: seller.top_products,
// Массив объектов вида: { "sku": "SKU_008","quantity": 10}, топ-10 товаров продавца
        bonus: Number(seller.bonus.toFixed(2))
// Число с двумя знаками после точки, бонус продавца
}));

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}

