import React, { useState, useEffect } from "react";
import axios from "axios";

// Base URL for the API
const API_BASE_URL = "http://127.0.0.1:8000";

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [formProduct, setFormProduct] = useState({
        id: null,
        company: "",
        status: "",
        imageUrl: "",
        note: "",
        date: "", 
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to fetch products. Please try again later.");
        }
    };

    const handleChange = (e) => {
        setFormProduct({
            ...formProduct,
            [e.target.name]: e.target.value,
        });
    };

    const createOrUpdateProduct = async () => {
        
        if (!formProduct.status) {
            setError("Status is required.");
            return;
        }

        if (formProduct.note.length < 5) {
            setError("Note must be at least 5 characters long.");
            return;
        }

        try {
            if (formProduct.id) {
                
                await axios.put(
                    `${API_BASE_URL}/products/${formProduct.id}`,
                    formProduct
                );
            } else {
                
                await axios.post(`${API_BASE_URL}/products`, formProduct);
            }
            fetchProducts();
            setFormProduct({
                id: null,
                company: "",
                status: "",
                imageUrl: "",
                note: "",
                date: "", 
            });
            setError(null);
            setSuccess("Product saved successfully.");
        } catch (error) {
            console.error("Error saving product:", error.response || error);
            setError("Failed to save product. Please try again.");
        }
    };

    const startUpdate = (product) => {
        setFormProduct(product);
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error.response || error);
            setError("Failed to delete product. Please try again.");
        }
    };

    return (
        <div className="dashboard page-bg">
            <h1>Entry Dashboard</h1>
            <h4>Manage your job hunting</h4>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <div className="new-product-form island">
                <h5>
                    {formProduct.id ? "Update Entry" : "Create New Entry"}
                </h5>
                <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={formProduct.company}
                    onChange={handleChange}
                />
                <select
                    name="status"
                    value={formProduct.status}
                    onChange={handleChange}
                >
                    <option value="">Select Status</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                </select>
                <input
                    type="text"
                    name="imageUrl"
                    placeholder="Company Logo"
                    value={formProduct.imageUrl}
                    onChange={handleChange}
                />
                <input
                    type="datetime-local"
                    name="date" // Corrected field name
                    value={formProduct.date}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="note"
                    placeholder="Note"
                    value={formProduct.note}
                    onChange={handleChange}
                />
                <button onClick={createOrUpdateProduct}>
                    {formProduct.id ? "Update Entry" : "Add Entry"}
                </button>
            </div>
            <div className="cards">
                {products.map((product) => (
                    <div key={product.id} className="card">
                        <img
                            src={product.imageUrl}
                            alt={product.company}
                            className="card-image"
                        />
                        <h5 className="card-title">{product.company}</h5>
                        <p className="card-description">{product.status}</p>
                        <p className="card-note">{product.note}</p>
                        <p className="card-date">{product.date}</p> 
                        <div className="buttons-container">
                            <button onClick={() => startUpdate(product)}>
                                Update
                            </button>
                            <button onClick={() => deleteProduct(product.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
