
export function Navbar() {
	return(
		<header className="header" id="accueil">
			<div className="container nav-container">

				<a href="#accueil" class="logo-placeholder" aria-label="110 Street - Accueil">
					<img src="./assets/images/logo.png" alt="logo"/>
				</a>

				<button class="menu-toggle" id="menuToggle" aria-label="Ouvrir le menu" aria-expanded="false">
					<span></span>
					<span></span>
					<span></span>
				</button>

				<nav class="navigation" id="navigation">
					<a href="#accueil" class="nav-link active">Accueil</a>
					<a href="#menu" class="nav-link">Menu</a>
					<a href="#contact" class="nav-link">Contact</a>
				</nav>

				<button class="btn btn-primary header-order" id="headerOrder">
					Commander
				</button>

			</div>
    </header>
	)
	
}