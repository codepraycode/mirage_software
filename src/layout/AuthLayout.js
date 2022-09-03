import React from 'react';
import { brand_logo } from '../constants/assets';

export default function AuthLayout({title, children,loading, footer }) {
    return (
        <div className="login_screen">
            <div className="screen" >
                {
                    loading ?
                        <span className="spinner">
                            <i className="fas fa-spinner"></i>
                        </span>
                        :
                        null
                }

                <div className="logo">
                    <img src={brand_logo} alt="Mirage" />
                </div>

                <h5 className="text-center">{title}</h5>

                {children}
                
                {footer}

            </div>
        </div>
    )
}