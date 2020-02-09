import React, { useState } from "react";
import IngredentList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";

const Ingredients = () => {
	const [userIngredients, setUserIngredients] = useState([]);

	const addIngredientHandler = ingredient => {
		setUserIngredients(prevIngredients => [
			...prevIngredients,
			{ id: Math.random().toString(), ...ingredient }
		]);
	};

	return (
		<div className="App">
			<IngredientForm onAddIngredient={addIngredientHandler}/>

			<section>
				<Search />
				<IngredentList ingredients={userIngredients} onRemoveItem={()=>{}}/>
			</section>
		</div>
	);
};

export default Ingredients;
