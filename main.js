 // html elemetleri secildi 
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const submitBtn = document.querySelector(".submit-btn")
const alert = document.querySelector(".alert")
const clearBtn = document.querySelector(".clear-btn")


//* Duzenleme secenekleri
let editFlag = false;       // duzenleme modunda olup olmadigini belirtir
let editID ="" ;            // duzenleme yapilan ogenin benzersiz kimligi 
let editElement;



//! Fonksiyonlar
const setBackToDefault = () => {      //yapilan her islemden sonra liste varsayilan ayarlarina doner 
    grocery.value = ""                  //bu ayarlari her fonksiyonda tekrar yazmamak icin bu fonksyiyonu kullanicaz.
    editFlag = false
    editID = "" 
    submitBtn.textContent = "Add"
 }


const addItem =(e) =>{ 
    e.preventDefault();                                    // formun otomotik olarak gonderilmesini engeller

    const value = grocery.value                             // form icindeki inputun degerini value degiskenine atadik
    
    const id = new Date().getTime().toString();              //benzersiz bir id olusturduk tostring ile stringe cevirdik
 


    //* eger input bos degilse ve duzenleme modunda degilse calisacak blok yapisi
    if(value !=="" && !editFlag){
        const element =document.createElement("article")      //  element adinda yeni bir "article" etiketi olusturduk
        let attr = document.createAttribute("data-id")       // olusturdugumuz elemente "data-id" adinda bir oznitelik(attribute) ekledik
        attr.value = id;                                     // new Date ile olusturdugumuz benzersiz id yi "attr" ye atadik.

        element.setAttributeNode(attr);                      //setAttributeNode ile olusturdugumuz data-id yi article etiketine oznitelik olarak ekledik
        element.classList.add("grocery-item");              // olusturdugumuz article etiketine classlist ile grocery-item classini ekledik.
     
        element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
          <button type="button" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
          <button type="button" class="delete-btn"><i class="fa-solid fa-trash-can"></i></button>
        </div>`

        list.appendChild(element)                      // kapsayiciya(grocery-list) olusturdugumuz article etiketini ekledik (inputa girdiklerimiz ekrana geliyor)
        // alert.innerText = "Added Successfully";     // tum alert yapilarini bu sekil tek tek tanimlamak yerine,
        // alert.classList.add("alert-success")           displayAlert diye bir fonksiyon olusturucaz YUKARDA.
        displayAlert( "Added Successfully", "success")
        container.classList.add("show-container")       // grocery-container icindeki clear-btn listeye urun eklendiginde gorunur olacak

        addToLocalStorage(id , value)      //! LocalStorage'a ekleme yapmak icin

        setBackToDefault()
       

        const deleteBtn = element.querySelector(".delete-btn")
        deleteBtn.addEventListener("click", deleteItem  )

        const editBtn = element.querySelector(".edit-btn")
        editBtn.addEventListener("click" , editItem )
        
        
    } else if (value !== "" && editFlag){
        editElement.innerText = value ;                     //degistirecegimiz p etiketinin icerik kismina kullanicinin girdigi degeri gonderdik.
        displayAlert("Product Changed" , "success")         // ekrana alert yapisini bastirdik
        // submitBtn.textContent = "Add"                       //gonderme butonunu tekrar 'Add' haline cevirdik
        // editFlag = false ;                                // duzenleme modundan tekrar cikardik
        editLocalStorage(editID,value)
        setBackToDefault()

        }
       
 
}

const displayAlert = (text, action) =>{                     // displayAlert fonksiyonunu tanimladik text ve action(class) olarak iki parametre aliyor.
       
    alert.textContent = text ;                              // alert ve classi eklendi
    alert.classList.add(`alert-${action}`);

    setTimeout(()=>{                                    // setTimeout ile alert 2sn sonra ekrandan kaldiriliyor.
        alert.textContent = ""
        alert.classList.remove(`alert-${action}`);
    },2000);
};   


//* tikladigimizda article etiketini ekrandan kaldiracak fonksiyon
const deleteItem = (e)=>{
    // console.log(e.currentTarget.parentElement.parentElement)       // delete butonunun kapsayicisi olan article'a ulastik. 

    const element = e.currentTarget.parentElement.parentElement       // ulastigimiz article'i bir degiskene aktardik
    // console.log(element.dataset.id)                                // elementin (article) id sine ulastik
    const id = element.dataset.id                                  // bunu id degiskenine aktardik.id yi duzenle kisminda kullmak icin olusturduk

    list.removeChild(element)                              // grocery-list'in icindeki article yi silecegimiz icin removeChild'i kullandik ve list'in icinden article silindi 
    displayAlert("Product Deleted", "danger")
    setBackToDefault()
    removeFromLocalStorage(id)
}



const editItem = (e) => {
    // console.log(e.currentTarget.parentElement.parentElement)
    const element = e.currentTarget.parentElement.parentElement      // article etiketine parentElementlerle eristik element degiskenine atadik
    editElement = e.currentTarget.parentElement.previousElementSibling  //butonun kapsayicisina eristikten sonra previousElementSibling yontemiyle kardes element olan p etiketine eristik ve degiskene atadik

    grocery.value = editElement.innerText                              //tikladigimizda "article" etiketi icindeki p etiketinin text'ini inputun icine gonderdik

    editFlag = true ; 
    editID = element.dataset.id                                      // Duzenlenen ogenin kimligine erisme

    submitBtn.textContent = "Edit"                               // duzenleme isleminde Add butonu Edit olarak degisecek
}



   const clearItems = () => {
    const items = document.querySelectorAll(".grocery-item")
    if(items.length > 0 ){                              //listede oge varsa calisir
     items.forEach((item) => list.removeChild(item));    // forEach ile liste icindeki tum articellari doner ve temziler
    }
 
    container.classList.remove("show-container")        // list temizlendikten sonra container yaoisini kaldiriyor gizliyor
    displayAlert("List Cleared" , "danger");
    setBackToDefault()
 }

 const createListItem = (id, value)=>{
    const element =document.createElement("article")      //  element adinda yeni bir "article" etiketi olusturduk
        let attr = document.createAttribute("data-id")       // olusturdugumuz elemente "data-id" adinda bir oznitelik(attribute) ekledik
        attr.value = id;                                     // new Date ile olusturdugumuz benzersiz id yi "attr" ye atadik.

        element.setAttributeNode(attr);                      //setAttributeNode ile olusturdugumuz data-id yi article etiketine oznitelik olarak ekledik
        element.classList.add("grocery-item");              // olusturdugumuz article etiketine classlist ile grocery-item classini ekledik.
     
        element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
          <button type="button" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
          <button type="button" class="delete-btn"><i class="fa-solid fa-trash-can"></i></button>
        </div>`

        list.appendChild(element)                      // kapsayiciya(grocery-list) olusturdugumuz article etiketini ekledik (inputa girdiklerimiz ekrana geliyor)
    
        container.classList.add("show-container")       // grocery-container icindeki clear-btn listeye urun eklendiginde gorunur olacak


        const deleteBtn = element.querySelector(".delete-btn")
        deleteBtn.addEventListener("click", deleteItem  )

        const editBtn = element.querySelector(".edit-btn")
        editBtn.addEventListener("click" , editItem )
        

 }
const setupItems =() => {
   let items = getLocalStorage()

   if(items.length > 0 ){
    items.forEach((item) => {
        createListItem(item.id, item.value)
    })
   }
}


//! Local Storage
//yerel depoya oge ekleme islemi 
const addToLocalStorage = (id, value) => {
    const grocery = {id ,value}
    let items = getLocalStorage()
    items.push(grocery)
    console.log(items)

    localStorage.setItem("list", JSON.stringify(items))
}

// yerel depodan ogeleri alma islemi
const getLocalStorage = () => {
  return localStorage.getItem("list") 
   ? JSON.parse(localStorage.getItem("list")) : []  

}

// local storage'tan veriyi silme
const removeFromLocalStorage =(id)=>{
        
    let items = getLocalStorage()       // local storage 'da bulunan verileri getirir
   
   items =  items.filter((item) => {       //tikladigim etiketin id'si ile LocalStorage'in id'si  esit degil ise bunu diziden cikar ve yeni bir eleman aktar.
        if (item.id !== id){
            return item
        }
    })
    console.log(items)
    localStorage.setItem("list", JSON.stringify(items))  //gelen veriyi stringe cevirerek items leri tekrar ekle
}


// yerel depoda guncelleme islemi 
const editLocalStorage =( id ,value) => {
    let items = getLocalStorage()

    // yerel depodaki verilerin id'si ile guncellenecek olan verinin id'si birbirine esit ise
    // inputa girilen value degiskenini al local storage'ta bulunana verinin value'suna aktar.
   items =  items.map((item) =>  {
        if(item.id === id) {
            item.value = value
        }
        return item
    })
  localStorage.setItem("list" , JSON.stringify(items))
}




//! Olay izleyicileri
form.addEventListener("submit",addItem)
clearBtn.addEventListener("click" , clearItems)
window.addEventListener("DOMContentLoaded", setupItems);





















