import React, { useState, useEffect } from "react";
import axios from "axios";

// API endpoint for fetching products
const API_BASE_URL = "http://127.0.0.1:8000/products";

const View = ({ userName }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchCriteria, setSearchCriteria] = useState({
        company: "",
        status: "",
        date: ""
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(API_BASE_URL);
                setProducts(response.data);
                setFilteredProducts(response.data); 
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);  
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchCriteria, products]);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchCriteria(prevCriteria => ({
            ...prevCriteria,
            [name]: value
        }));
    };

    const filterProducts = () => {
        const { company, status, date } = searchCriteria;
        const filtered = products.filter(product => {
            return (
                (company ? product.company.toLowerCase().includes(company.toLowerCase()) : true) &&
                (status ? product.status === status : true) &&
                (date ? product.date.startsWith(date) : true)
            );
        });
        setFilteredProducts(filtered);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="shop page-bg">
            <h1>Welcome, {userName ? userName : "User"}</h1>
            <h4>Filter Job Applications</h4>
            <div className="search-form">
                <input
                    type="text"
                    name="company"
                    placeholder="Search by Company"
                    value={searchCriteria.company}
                    onChange={handleSearchChange}
                />
                <input
                    list="status-options"
                    name="status"
                    placeholder="Filter by Status"
                    value={searchCriteria.status}
                    onChange={handleSearchChange}
                />
                <datalist id="status-options">
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                </datalist>
                <input
                    type="date"
                    name="date"
                    placeholder="Filter by Date"
                    value={searchCriteria.date}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="cards">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="card">
                        <img
                            src={product.imageUrl}
                            alt={product.company}
                            className="card-image"
                        />
                        <h5 className="card-title">{product.company}</h5>
                        <p className="card-description">{product.status}</p>
                        <p className="card-note">{product.note}</p>
                        <p className="card-date">{new Date(product.date).toLocaleDateString()}</p> 
                    </div>
                ))}
            </div>
        </div>
    );
};

export default View;
