import React, { useState, useEffect, useRef } from "react";
import useHttp from '../../hooks/http'

import Card from "../UI/Card";
import "./Search.css";
import ErrorModal from "../UI/ErrorModal";

const Search = React.memo(props => {
	const { onLoadIngredients } = props;
	const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();
  const {isLoading, data, error, sendRequest, clear} = useHttp()

	useEffect(() => {
		const timer = setTimeout(() => {
			if (enteredFilter === inputRef.current.value) {
        const query =
        enteredFilter.length === 0
          ? ""
          : `?orderBy="title"&equalTo="${enteredFilter}"`;
        let url = "https://react-hooks-8efdb.firebaseio.com/ingredients.json" + query

        sendRequest(url, "GET")

      }
    }, 500);
    return () => {
      clearTimeout(timer)
    }
  }, [enteredFilter, sendRequest, inputRef]);
  
  useEffect(() => {
    if(!isLoading && !error && data){
      const loadedIngredients = []

      for (const key in data){
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        })

      }

      onLoadIngredients(loadedIngredients)

    }


  }, [onLoadIngredients, data, isLoading, error]
)
	return (
		<section className="search">

      {error && (
        <ErrorModal onClose={clear}>{error}</ErrorModal>
      )}

			<Card>
				<div className="search-input">
					<label>Filter by Title</label>
          {isLoading && "loading..."}
					<input
						ref={inputRef}
						type="text"
						value={enteredFilter}
						onChange={event => setEnteredFilter(event.target.value)}
					/>
          
				</div>
			</Card>
		</section>
	);
});

export default Search;
