import React, { useState, useEffect, useCallback } from "react";
import IngredentList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";

const Ingredients = () => {
	const [userIngredients, setUserIngredients] = useState([]);

	// useEffect(() => {
	// 	fetch("https://react-hooks-8efdb.firebaseio.com/ingredients.json")
	// 		.then(response => response.json())
	// 		.then(responseData => {
	// 			const loadedIngredients = [];
	// 			for (const key in responseData) {
	// 				loadedIngredients.push({
	// 					id: key,
	// 					title: responseData[key].title,
	// 					amount: responseData[key].amount
	// 				});
	// 			}
	// 			setUserIngredients(loadedIngredients);
	// 		});
	// }, []);

	// Runing after each rendering
	useEffect(() => {
		console.log("Rendering Ingredients", userIngredients);
	}, [userIngredients]);

	const filteredIngredientsHandler = useCallback(filteredIngredients => {
		setUserIngredients(filteredIngredients);
	}, []);

	const addIngredientHandler = ingredient => {
		fetch("https://react-hooks-8efdb.firebaseio.com/ingredients.json", {
			method: "POST",
			body: JSON.stringify(ingredient),
			headers: { "Content-Type": "application/json" }
		})
			.then(response => {
				return response.json();
			})
			.then(responseData => {
				setUserIngredients(prevIngredients => [
					...prevIngredients,
					{ id: responseData.name, ...ingredient }
				]);
			});
	};

	const removeIngredientHandler = ingredientId => {
		setUserIngredients(prevIngredients =>
			prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
		);
	};

	return (
		<div className="App">
			<IngredientForm onAddIngredient={addIngredientHandler} />

			<section>
				<Search onLoadIngredients={filteredIngredientsHandler} />
				<IngredentList
					ingredients={userIngredients}
					onRemoveItem={removeIngredientHandler}
				/>
			</section>
		</div>
	);
};

export default Ingredients;
