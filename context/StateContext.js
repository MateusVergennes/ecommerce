import React, { createContext, useContext, useState, useEffect } from "react"

import { toast } from 'react-hot-toast'

const Context = createContext()


export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantities, setTotalQuantities] = useState(0)
    const [qty, setQty] = useState(1)
    const [numMesa, setnumMesa] = useState(0)

    let foundProduct
    let index

    const handleInput = (e) => {
        e.preventDefault()
        if (e.target.value > 99) {
          toast.error('please 2 numbers only')
          e.target.value = 0
          return false
        }
        setnumMesa(e.target.value)
      }

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id)
        
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity)

        if (checkProductInCart) {

            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })

            setCartItems(updatedCartItems)
        } else {
            product.quantity = quantity
            
            setCartItems([...cartItems, { ...product }])
        }
        
        toast.success(`${qty} ${product.name} added to the cart`)
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id)
        const newCartItems = cartItems.filter((item) => item._id !== product._id)

        setTotalPrice( (prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity)
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity)
        setCartItems(newCartItems)

        toast.error(`${qty} ${product.name} deleted from cart`)
    }

    const toggleCartItemQuantity = (id, value) => {
        
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id)
        
        const newCartItems = cartItems.filter((item) => item._id !== id)

        if(value == 'inc'){//increment +
            setCartItems( prevCartItems => 
                prevCartItems.map( item => {          
                    if (item._id === id){
                        return {...item, quantity: foundProduct.quantity + 1}
                    }
                    return item
                })
            );

            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)

            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
        }else if(value === 'dec'){//decrement -
            if(foundProduct.quantity > 1) {
                setCartItems( prevCartItems => 
                    prevCartItems.map( item => {          
                        if (item._id === id){
                            return {...item, quantity: foundProduct.quantity - 1}
                        }
                        return item
                    })
                );

                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)

                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
            }
        }
    }

    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }
    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1

            return prevQty - 1
        })
    }

    return (
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuantity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities,
                numMesa,
                setnumMesa,
                handleInput
            }}
        >        
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context)