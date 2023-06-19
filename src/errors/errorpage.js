import React from 'react'
import { Link } from 'react-router-dom'

export default function ErrorPage() {
    return (
        <div id="app">
            <section class="section">
                <div class="container mt-5">
                    <div class="page-error">
                        <div class="page-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24"><path fill="currentColor" d="M16.707 2.293A.996.996 0 0 0 16 2H8a.996.996 0 0 0-.707.293l-5 5A.996.996 0 0 0 2 8v8c0 .266.105.52.293.707l5 5A.996.996 0 0 0 8 22h8c.266 0 .52-.105.707-.293l5-5A.996.996 0 0 0 22 16V8a.996.996 0 0 0-.293-.707l-5-5zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>                            <div class="page-description">
                                Une erreur inattendu c'est produite lors du chargement de la page. <br />
                                Veuillez <Link onClick={() => window.history.back()}>retourner a la page précedente</Link> et  réessayez l'action  {' '}

                            </div>
                            <div class="page-search">
                                <form>
                                    <div class="form-group floating-addon floating-addon-not-append">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">
                                                    <i class="fas fa-search"></i>
                                                </div>
                                            </div>
                                            <input type="text" class="form-control" placeholder="Recherche" />
                                            <div class="input-group-append">
                                                <button class="btn btn-primary btn-lg">
                                                    recherche
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
