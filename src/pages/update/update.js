import React from 'react'

export default function Update() {
    return (
        <div id="app">
            <section class="section">
                <div class="container mt-5">
                    <div class="page-error">
                        <div class="page-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24"><path fill="currentColor" d="M4 20v-2h2.725q-1.275-1.1-2-2.65T4 12q0-2.8 1.7-4.938T10 4.25v2.1q-1.75.625-2.875 2.163T6 12q0 1.35.537 2.488T8 16.45V14h2v6H4Zm11 0q-1.25 0-2.125-.875T12 17q0-1.2.825-2.063t2.025-.912q.425-.9 1.263-1.463T18 12q1.325 0 2.288.863T21.45 15q1.05 0 1.8.725t.75 1.75q0 1.05-.725 1.788T21.5 20H15Zm2.9-9q-.175-1.025-.675-1.9T16 7.55V10h-2V4h6v2h-2.725q1.075.95 1.763 2.225T19.925 11H17.9Z" /></svg>
                            <div class="page-description">
                                Cette sera disponible dans les prochaine mis à jour. <br />
                                Continuez de profiter des autres fonctionnalité de {' '}
                                <a href='/'>Online Service</a>
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
                                {/* <div class="mt-3">
                                    <a href="/?from=404&klm=user&to=dashboard">Retourner à l'accueil</a>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}