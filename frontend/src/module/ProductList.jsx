import { useState, useEffect, useContext } from "react";
import {getCartData, patchCartData, postCartData} from './dataaccess/CartDataAccess.js'
import { CartInfo } from "./CartInfo.jsx";
import { useSearchParams } from "react-router-dom";


export default function ProductList({ searchKey, setSearchKey, products, cartData, cartIsChanged, setCartIsChanged}) {
    // navigate from sales.jsx with '/products?category=${category}'
    // construction : category = parameter from url ${category}
    const [searchParams] = useSearchParams();
    let paramCategory = searchParams.get('category');

    useEffect(() => {
        const obj = {category: paramCategory};
        setSearchKey({...searchKey, category: obj.category});
    }, [paramCategory])

    return(
        <div className="card-container">
            {Array.isArray(products) && 
             products.map((product) => {
                return(
                    <div key={product.id} className="card">
                        <a href="#">
                            <img src={product.imgUrl1} alt="" />
                        </a>
                        <div className="card-content-container">
                            <h4>{product.title}</h4>
                            <h3>{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ':-'}</h3>
                            <p>Lager: {product.inventory}</p>
                            <div className="button-div">
                                <Button 
                                    currentProduct={product}
                                    cartData={cartData}
                                    cartIsChanged={cartIsChanged} 
                                    setCartIsChanged={setCartIsChanged}/>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// [Köp] button component
function Button({currentProduct, cartData, cartIsChanged, setCartIsChanged}) {

    function handleClick(product) {
        const dataInCart = cartData.find((item) => item.id === product.id);
        
        // check if data is in cart
        if(dataInCart == undefined){
            // current product does not exists in cart
            // POST a new data into cart.json
            postCartData(product).then((postData) => {
                // console.log('postCartData return ', postData);
                setCartIsChanged(!cartIsChanged);
            });
        } else {
            // Count up [amount] in cart.json file when data (id=XXX) exists
            patchCartData(product.id, dataInCart.amount, true).then((patchData) => {
                // console.log('patchCartData return ', patchData);
                setCartIsChanged(!cartIsChanged);
            });
        }
    }

    return(
        <>
            {/* call handleClick only when button is clicked */}
            <button disabled={ parseInt(currentProduct.inventory) == 0} 
                    onClick={() => handleClick(currentProduct)}>Köp</button>
        </>
    )
}