import React from "react";
import {ipAPI} from "../config";

function Produits() {
	const [produits, setProduits] = React.useState(null);
	const [panier, setPanier] = React.useState(null);
	const [erreur, setErreur] = React.useState(null);

	React.useEffect(() => {
		let panier = JSON.parse(localStorage.getItem("panier")) || [];
		setPanier(panier);
		fetch(ipAPI + "all")
			.then((res) => res.json())
			.then((data) => {
				const newData = data.map((dataProduit) => {
					let produitDansPanier = panier.filter((produit) => produit._id === dataProduit._id);
					dataProduit.quantite = produitDansPanier.length > 0 ? dataProduit.quantite - produitDansPanier[0].quantite : dataProduit.quantite;
					return dataProduit
				});
				setProduits(newData);
			})
			.catch(() => {
				setErreur("Impossible de charger les produits");
				setProduits([])
			});
	}, []);

	function setProduitSelectionne(produitSelectionne) {
		let produit = panier.filter((p) => p._id === produitSelectionne._id);

		if (produit.length === 0) {
			panier.push({
				_id: produitSelectionne._id,
				title: produitSelectionne.title,
				quantite: 1,
				prix: produitSelectionne.prix
			});
			setPanier(panier)
		} else {
			setPanier(panier.map((produit) => {
				produit.quantite = produit._id === produitSelectionne._id ? produit.quantite + 1 : produit.quantite;
				return produit;
			}));
		}
		setProduits(produits.map((produit) => {
			if (produit._id === produitSelectionne._id) {
				produit.quantite = produit.quantite - 1;
			}
			return produit;
		}));
		localStorage.setItem("panier", JSON.stringify(panier));
	}

	// affichage du panier s'il n'est pas vide
	function voirPanier() {
		return (
			<div>
				<h1>Panier</h1>
				<table style={{ border: "1px solid black" }}>
					<thead>
					<tr>
						<th>Produit</th>
						<th>Quantité</th>
					</tr>
					</thead>
					<tbody>
					{!panier ?
						<tr>
							<td>Loading ...</td>
							<td>Loading ...</td>
						</tr> :
						panier.map((produit) => (
							<tr key={produit._id}>
								<td>{produit.title}</td>
								<td>{produit.quantite}</td>
							</tr>
						))}
					</tbody>
				</table>
				<a href={"/panier"}>Voir le panier</a>
			</div>
		);
	}

	return (
		<div>
			<h1>Listes des produits</h1>
			{erreur ? <span style={{ color: "red" }}>{erreur}</span> : null}
			<ul>
				{!produits ? "Loading..." : produits.map((produit) => (
					<li key={produit._id}>
						{produit.title} - Prix : {produit.prix}€
						- Quantité : {produit.quantite} -
						description : {produit.description} -
						{produit.quantite <= 0 ? " Rupture de stock" :
							<button onClick={() => {
								setProduitSelectionne(produit);
							}}>Ajouter au panier</button>
						}
					</li>
				))}
			</ul>
			<br/>
			{erreur || !produits ? "" : panier && panier.length === 0 ? "Votre panier est vide" : voirPanier()}
		</div>
	);
}


export default Produits;