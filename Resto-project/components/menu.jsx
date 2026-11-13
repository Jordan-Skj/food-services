export function Menu () {
	return (
		<section className="menu-section" id="menu">

            <div className="container">

                <div className="section-heading">
                    <span className="eyebrow">DÉCOUVREZ NOS SPÉCIALITÉS</span>

                    <h2>Notre <span>menu</span></h2>

                    <p>
                        Des saveurs généreuses et des recettes préparées
                        pour satisfaire toutes vos envies.
                    </p>
                </div>

                <div className="menu-filters" id="menuFilters">

                    <button className="filter-btn active" data-category="all">Tous</button>

                    <button className="filter-btn" data-category="burgers">Burgers</button>

                    <button className="filter-btn" data-category="poulet">Poulet</button>

                    <button className="filter-btn" data-category="grillades">Plats du monde</button>

                    <button className="filter-btn" data-category="desserts">Desserts & boissons</button>

                </div>


            
                <div className="products-grid" id="productsGrid"></div>

            </div>

        </section>
	)
}