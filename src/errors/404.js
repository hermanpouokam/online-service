import React from 'react'

export default function Error() {
    return (
        <div id="app">
            <section class="section">
                <div class="container mt-5">
                    <div class="page-error">
                        <div class="page-inner">
                            <h1>404</h1>
                            <div class="page-description">
                                La page que vous recherchez est introuvable.
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
                                <div class="mt-3">
                                    <a href="/?from=404&klm=user&to=dashboard">Retourner à l'accueil</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
