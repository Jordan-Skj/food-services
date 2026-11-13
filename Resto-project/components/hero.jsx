export function Hero () {
	return (
		<>
		<section className="hero">

            <div className="container hero-content">

                <span className="eyebrow">BIENVENUE CHEZ 110 STREET</span>

                <h1>
                    STREET FOOD. GOÛT
                    <span>INTERNATIONAL.</span>
                </h1>

                <p>
                    Burgers, poulet rôti, brochettes, crevettes et bien plus.
                    Savourez chez nous ou faites-vous livrer 24h/24 et 7j/7.
                </p>

                <a href="#menu" className="btn btn-primary hero-button">
                    Voir le menu
                </a>

            </div>

            <div className="hero-visual">


                <div className="hero-image-placeholder">
					<img src="./assets/images/hero-food.png" alt=""/>
                </div>

            </div>

        </section>
		</>
	)
}