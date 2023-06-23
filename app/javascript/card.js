let payjp;


const initializePayjp = () => {
 
 // gonが定義されているか否かの条件分岐
 if (typeof gon == 'undefined') return null;


 const publicKey = gon.public_key


 // payjsがインスタンス化されているか否かの条件分岐
 if (!payjp) {
   payjp = Payjp(publicKey)
 }
};

const pay = () => {
const form = document.getElementById('charge-form')

 // 購入ページのみコードを読み込むための条件分岐
 if (!form) return null;


 const publicKey = gon.public_key
 console.log(publicKey)
 const elements = payjp.elements();
 const numberElement = elements.create('cardNumber');
 const expiryElement = elements.create('cardExpiry');
 const cvcElement = elements.create('cardCvc');


 numberElement.mount('#number-form');
 expiryElement.mount('#expiry-form');
 cvcElement.mount('#cvc-form');


 form.addEventListener("submit", (e) => {
   payjp.createToken(numberElement).then(function (response) {
     if (response.error) {
     } else {
       const token = response.id;
       const renderDom = document.getElementById("charge-form");
       const tokenObj = `<input value=${token} name='token' type="hidden">`;
       renderDom.insertAdjacentHTML("beforeend", tokenObj);
     }
     numberElement.clear();
     expiryElement.clear();
     cvcElement.clear();
     document.getElementById("charge-form").submit();
   });
   e.preventDefault();
 });
};


window.addEventListener("turbo:load", () => {
 initializePayjp();
 pay();
});
