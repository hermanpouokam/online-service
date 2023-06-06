import React, { useRef, useState } from 'react'

export default function CustomInput({ value, onChange, placeholder, name }) {

    const inputRef = useRef()
    const [focused, setFocused] = useState(false)

    return (
        <div class='col-lg-6 col-md-6 col-sm-12 row mr-sm-2 ' onBlur={() => setFocused(false)}>
            <input type="text" class={`form-control disabled mb-2 mr-sm-1 transition-2 ${focused ? 'col-6' : 'col-7'}`} id="inlineFormInputName2"
                placeholder="Article" value={name} />
            <input
                ref={inputRef}
                type='number'
                name={name}
                onFocus={() => setTimeout(() => {
                    setFocused(true)
                }, 50)}
                placeholder={placeholder}
                class={`form-control h-100 transition-2 ${focused ? 'col-2' : 'col-3'} mb-2" id="inlineFormInputName2`}
                value={value}
                min={1}
                onChange={onChange}
            />
            {focused && <div class={`col-1 d-flex justify-content-center align-items-center transition-3`}>
                <button onClick={() => alert('btn cliked')} class="btn btn-icon text-primary btn-md h-90 btn-success  mr-sm-1"><i class="fa fa-check"></i></button>
            </div>}
        </div >
    )
}
