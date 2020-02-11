import React, { useReducer, useState, useEffect, useCallback } from "react";
import IngredentList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
	switch (action.type) {
		case "SET":
			return action.ingredients;

		case "ADD":
			return [...currentIngredients, action.ingredient];

		case "DELETE":
			return currentIngredients.filter(ing => ing.id !== action.id);

		default:
			throw new Error("Should not get there!");
	}
};

const Ingredients = () => {
	const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	useEffect(() => {
		console.log("Rendering Ingredients", userIngredients);
	}, [userIngredients]);

	const filteredIngredientsHandler = useCallback(filteredIngredients => {
		dispatch({ type: "SET", ingredients: filteredIngredients });
	}, []);

	const addIngredientHandler = ingredient => {
		setIsLoading(true);
		fetch("https://react-hooks-8efdb.firebaseio.com/ingredients.json", {
			method: "POST",
			body: JSON.stringify(ingredient),
			headers: { "Content-Type": "application/json" }
		})
			.then(response => {
				setIsLoading(false);
				return response.json();
			})
			.then(responseData => {
				dispatch({
					type: "ADD",
					ingredient: { id: responseData.name, ...ingredient }
				});
			})
			.catch(error => {
				setIsLoading(false);
				setError(error.message);
			});
	};

	const removeIngredientHandler = ingredientId => {
		setIsLoading(true);
		fetch(
			`https://react-hooks-8efdb.firebaseio.com/ingredients/${ingredientId}.json`,
			{
				method: "DELETE"
			}
		)
			.then(response => {
				setIsLoading(false);
				dispatch({ type: "DELETE", id: ingredientId });
			})
			.catch(error => {
				setIsLoading(false);
				setError(error.message);
			});
	};

	const onClosingError = () => {
		setError(null);
	};

	return (
		<div className="App">
			{error && <ErrorModal onClose={onClosingError}>error</ErrorModal>}
			<IngredientForm
				onAddIngredient={addIngredientHandler}
				loading={isLoading}
			/>

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
