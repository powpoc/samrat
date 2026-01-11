import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { usePromo } from '../context/PromoContext';
import { useFestivals } from '../context/FestivalContext';
import { useSite } from '../context/SiteContext';
import { Plus, Edit, Trash2, X, Save, Tag, Star, Image as ImageIcon, Eye, EyeOff, Phone, AlertTriangle } from 'lucide-react';
import './Admin.css';

const Admin = () => {
    const { products, addProduct, updateProduct, deleteProduct, categories, addCategory, deleteCategory } = useProducts();
    const { promoCodes, addPromoCode, removePromoCode } = usePromo();
    const { festivals, addFestival, updateFestival, removeFestival, toggleFestivalStatus } = useFestivals();
    const { heroImage, updateHeroImage, whatsappNumber, updateWhatsappNumber, isMaintenanceMode, toggleMaintenanceMode } = useSite();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const initialForm = {
        sku: '',
        name: '',
        category: 'Punjabi',
        festival: '', // Added festival field
        price: '',
        image: '',
        description: '',
        isOffer: false,
        isHidden: false,
        offerPrice: '',
        images: [],
        colors: [],
        sizes: [],
        inventory: [] // [{ color: 'Gold', sizes: { 'M': 5, 'L': 2 } }]
    };

    const [formData, setFormData] = useState(initialForm);
    const [invColor, setInvColor] = useState('');
    const [invSize, setInvSize] = useState('');
    const [invQty, setInvQty] = useState('');

    const [activeTab, setActiveTab] = useState('products'); // 'products', 'promos', 'festivals', 'settings'
    const [newPromo, setNewPromo] = useState({ code: '', type: 'percent', value: '' });
    const [newFestivalName, setNewFestivalName] = useState('');

    const [newFestivalImage, setNewFestivalImage] = useState('');
    const [editingFestivalId, setEditingFestivalId] = useState(null);
    const [newCategory, setNewCategory] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'ulab1234') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect Password');
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);
        setFormData({
            ...product,
            inventory: product.inventory || []
        });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingId(null);
        setFormData(initialForm);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    const saveProduct = (e) => {
        e.preventDefault();
        // Reconstruct flat arrays for compatibility with existing UI
        const colors = [...new Set(formData.inventory.map(i => i.color))];
        const sizes = [...new Set(formData.inventory.flatMap(i => Object.keys(i.sizes)))];

        // Ensure images array has at least the main image
        const imagesList = formData.images.length > 0 ? formData.images : [formData.image];

        const finalProduct = {
            ...formData,
            price: Number(formData.price),
            offerPrice: formData.isOffer ? Number(formData.offerPrice) : null,
            colors,
            sizes,
            images: imagesList
        };

        if (editingId) {
            updateProduct(editingId, finalProduct);
        } else {
            addProduct(finalProduct);
        }
        setIsModalOpen(false);
    };

    const addInventoryItem = () => {
        if (!invColor || !invSize || !invQty) return;

        // Check if color exists
        const existingColorIdx = formData.inventory.findIndex(i => i.color === invColor);

        let newInventory = [...formData.inventory];

        if (existingColorIdx >= 0) {
            // Update existing color entry
            newInventory[existingColorIdx] = {
                ...newInventory[existingColorIdx],
                sizes: {
                    ...newInventory[existingColorIdx].sizes,
                    [invSize]: Number(invQty)
                }
            };
        } else {
            // Create new color entry
            newInventory.push({
                color: invColor,
                sizes: { [invSize]: Number(invQty) }
            });
        }

        setFormData({ ...formData, inventory: newInventory });
        setInvSize('');
        setInvQty('');
        // Keep color for rapid entry
    };

    const removeInventoryItem = (color, size) => {
        let newInventory = [...formData.inventory];
        const idx = newInventory.findIndex(i => i.color === color);

        if (idx >= 0) {
            const newSizes = { ...newInventory[idx].sizes };
            delete newSizes[size];

            if (Object.keys(newSizes).length === 0) {
                // Remove color entirely if no sizes left
                newInventory.splice(idx, 1);
            } else {
                newInventory[idx] = { ...newInventory[idx], sizes: newSizes };
            }
            setFormData({ ...formData, inventory: newInventory });
        }
    };

    const handleMainImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryUpload = (e) => {
        const files = Array.from(e.target.files);
        Promise.all(files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        })).then(images => {
            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), ...images]
            }));
        });
    };

    const removeGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const updateInventoryQuantity = (color, size, newQty) => {
        let newInventory = [...formData.inventory];
        const idx = newInventory.findIndex(i => i.color === color);

        if (idx >= 0) {
            newInventory[idx] = {
                ...newInventory[idx],
                sizes: {
                    ...newInventory[idx].sizes,
                    [size]: Number(newQty)
                }
            };
            setFormData({ ...formData, inventory: newInventory });
        }
    };

    const handleAddPromo = (e) => {
        e.preventDefault();
        if (!newPromo.code || !newPromo.value) return;
        addPromoCode({
            ...newPromo,
            value: Number(newPromo.value)
        });
        setNewPromo({ code: '', type: 'percent', value: '' });
    };

    const handleSaveFestival = (e) => {
        e.preventDefault();
        if (newFestivalName.trim()) {
            if (editingFestivalId) {
                updateFestival(editingFestivalId, {
                    name: newFestivalName.trim(),
                    image: newFestivalImage
                });
                setEditingFestivalId(null);
            } else {
                addFestival(newFestivalName.trim(), newFestivalImage);
            }
            setNewFestivalName('');
            setNewFestivalImage('');
        }
    };

    const startEditFestival = (festival) => {
        setEditingFestivalId(festival.id);
        setNewFestivalName(festival.name);
        setNewFestivalImage(festival.image || '');
    };

    const cancelEditFestival = () => {
        setEditingFestivalId(null);
        setNewFestivalName('');
        setNewFestivalImage('');
    };

    const handleFestivalImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewFestivalImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleHeroImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateHeroImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteCategory = (cat) => {
        if (window.confirm(`Are you sure you want to delete the category "${cat}"?`)) {
            deleteCategory(cat);
        }
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (newCategory.trim()) {
            addCategory(newCategory.trim());
            setNewCategory('');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-page login-container">
                <div className="login-box">
                    <h2>Admin Access</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button className="btn btn-primary" type="submit">Unlock</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <header className="admin-header">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <h2>Admin Panel</h2>
                    <nav className="admin-nav-tabs">
                        <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                            Products
                        </button>
                        <button className={`tab-btn ${activeTab === 'promos' ? 'active' : ''}`} onClick={() => setActiveTab('promos')}>
                            Promo Codes
                        </button>
                        <button className={`tab-btn ${activeTab === 'festivals' ? 'active' : ''}`} onClick={() => setActiveTab('festivals')}>
                            Festivals
                        </button>
                        <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                            Settings
                        </button>
                    </nav>
                </div>
                {activeTab === 'products' && (
                    <button className="btn btn-primary" onClick={handleCreate}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> Add New Product
                    </button>
                )}
            </header>

            <div className="admin-dashboard">
                {activeTab === 'products' ? (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>SKU</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Variants (Color/Size)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} style={{ opacity: p.isHidden ? 0.5 : 1, background: p.isHidden ? '#f0f0f0' : 'transparent' }}>
                                    <td><img src={p.image} className="p-thumb" alt="" /></td>
                                    <td>{p.sku}</td>
                                    <td>{p.name}</td>
                                    <td>{p.category}</td>
                                    <td>৳{p.price.toLocaleString()}</td>
                                    <td>
                                        {p.inventory && p.inventory.map(i => (
                                            <div key={i.color} style={{ fontSize: '0.8rem' }}>
                                                <strong>{i.color}:</strong> {Object.entries(i.sizes).map(([s, q]) => `${s}(${q})`).join(', ')}
                                            </div>
                                        ))}
                                        {(!p.inventory || p.inventory.length === 0) && <span style={{ color: 'red' }}>N/A</span>}
                                    </td>
                                    <td>
                                        <button className="action-btn" onClick={() => handleEdit(p)}><Edit size={16} /></button>
                                        <button className="action-btn btn-delete" onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : activeTab === 'promos' ? (
                    <div className="promo-manager">
                        <div className="promo-create-card">
                            <h3>Create Promo Code</h3>
                            <form onSubmit={handleAddPromo} className="promo-form">
                                <input
                                    placeholder="Code (e.g. SAVE10)"
                                    value={newPromo.code}
                                    onChange={e => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                                    required
                                />
                                <select value={newPromo.type} onChange={e => setNewPromo({ ...newPromo, type: e.target.value })}>
                                    <option value="percent">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (৳)</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Value"
                                    value={newPromo.value}
                                    onChange={e => setNewPromo({ ...newPromo, value: e.target.value })}
                                    required
                                />
                                <button type="submit" className="btn btn-primary">Create</button>
                            </form>
                        </div>

                        <div className="promo-list">
                            <h3>Active Codes</h3>
                            {promoCodes.length === 0 && <p>No active promo codes.</p>}
                            <div className="promo-grid">
                                {promoCodes.map((promo, idx) => (
                                    <div key={idx} className="promo-card">
                                        <div className="promo-info">
                                            <span className="promo-code-badge"><Tag size={14} /> {promo.code}</span>
                                            <span className="promo-value">
                                                {promo.type === 'percent' ? `${promo.value}% OFF` : `৳${promo.value} OFF`}
                                            </span>
                                        </div>
                                        <button onClick={() => removePromoCode(promo.code)} className="btn-delete-icon">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'festivals' ? (
                    <div className="promo-manager">
                        {/* Reusing promo-manager class for consistent styling */}
                        <div className="promo-create-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>{editingFestivalId ? 'Edit Festival' : 'Add New Festival'}</h3>
                                {editingFestivalId && (
                                    <button type="button" onClick={cancelEditFestival} className="btn-reset-sidebar" style={{ margin: 0 }}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                            <form onSubmit={handleSaveFestival} className="promo-form">
                                <input
                                    placeholder="Festival Name (e.g. Eid Collection)"
                                    value={newFestivalName}
                                    onChange={e => setNewFestivalName(e.target.value)}
                                    required
                                />
                                <div className="form-group full-width" style={{ marginTop: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Festival Banner Image</label>
                                    <div className="image-upload-box" style={{ height: '100px' }}>
                                        {newFestivalImage ? (
                                            <div className="preview-container main-preview">
                                                <img src={newFestivalImage} alt="Festival" />
                                                <button type="button" className="btn-remove-img" onClick={() => setNewFestivalImage('')}>
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="upload-btn">
                                                <ImageIcon size={20} />
                                                <span>Add Image</span>
                                                <input type="file" accept="image/*" onChange={handleFestivalImageUpload} hidden />
                                            </label>
                                        )}
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                    {editingFestivalId ? 'Update Festival' : 'Add Festival'}
                                </button>
                            </form>
                        </div>
                        <div className="promo-list">
                            <h3>Active Festivals</h3>
                            {festivals.length === 0 && <p>No festivals added.</p>}
                            <div className="promo-grid">
                                {festivals.map(fest => (
                                    <div key={fest.id} className="promo-card" style={{ opacity: fest.isActive ? 1 : 0.6 }}>
                                        <div className="promo-info">
                                            <span className="promo-code-badge"><Star size={14} /> {fest.name}</span>
                                            {!fest.isActive && <span style={{ fontSize: '0.8rem', marginLeft: '0.5rem', color: '#666' }}>(Hidden)</span>}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <button onClick={() => toggleFestivalStatus(fest.id)} className="btn-delete-icon" style={{ marginRight: '0.5rem', color: 'var(--color-text-main)' }} title={fest.isActive ? "Hide" : "Show"}>
                                                {fest.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </button>
                                            <button onClick={() => startEditFestival(fest)} className="btn-delete-icon" style={{ marginRight: '0.5rem', color: 'var(--color-text-main)' }} title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => removeFestival(fest.id)} className="btn-delete-icon" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'settings' ? (
                    <div className="promo-manager">
                        <div className="promo-create-card">
                            <h3>Site Settings</h3>
                            <div className="form-group full-width">
                                <label>Hero Section Image</label>
                                <div className="image-upload-box">
                                    {heroImage ? (
                                        <div className="preview-container main-preview">
                                            <img src={heroImage} alt="Hero" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                            <button type="button" className="btn-remove-img" onClick={() => updateHeroImage('')}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="upload-btn">
                                            <ImageIcon size={24} />
                                            <span>Upload Hero Image</span>
                                            <input type="file" accept="image/*" onChange={handleHeroImageUpload} hidden />
                                        </label>
                                    )}
                                </div>
                            </div>
                            <div className="form-group full-width" style={{ marginTop: '2rem' }}>
                                <label><Phone size={16} /> WhatsApp Number</label>
                                <input
                                    type="text"
                                    placeholder="Enter number with country code (e.g. 8801712345678)"
                                    value={whatsappNumber}
                                    onChange={(e) => updateWhatsappNumber(e.target.value)}
                                    style={{ marginTop: '0.5rem' }}
                                />
                                <small style={{ color: '#666' }}>Enter number without spaces or special chars.</small>
                            </div>
                            <div className="form-group full-width" style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ff4444', borderRadius: '8px', background: '#fff0f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <label style={{ color: '#d32f2f' }}><AlertTriangle size={16} /> Maintenance Mode</label>
                                        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.2rem' }}>
                                            Enable to hide the site from users. Admin panel will remain accessible.
                                        </p>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={isMaintenanceMode}
                                            onChange={(e) => toggleMaintenanceMode(e.target.checked)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                            <div className="form-group full-width" style={{ marginTop: '2rem' }}>
                                <h3>Product Categories</h3>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', marginTop: '1rem' }}>
                                    <input
                                        placeholder="New Category Name"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                    <button className="btn btn-primary" onClick={handleAddCategory}>Add</button>
                                </div>
                                <div className="promo-grid">
                                    {categories.map(cat => (
                                        <div key={cat} className="promo-card" style={{ padding: '0.5rem 1rem' }}>
                                            <span style={{ fontWeight: 'bold' }}>{cat}</span>
                                            <button onClick={() => handleDeleteCategory(cat)} className="btn-delete-icon">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                ) : null}
            </div>

            {
                isModalOpen && (
                    <div className="admin-modal">
                        <div className="admin-form-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3>{editingId ? 'Edit Product' : 'New Product'}</h3>
                                <button onClick={() => setIsModalOpen(false)}><X /></button>
                            </div>

                            <form onSubmit={saveProduct} className="form-grid">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>SKU (Code)</label>
                                    <input value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Festival Collection (Optional)</label>
                                    <select value={formData.festival || ''} onChange={e => setFormData({ ...formData, festival: e.target.value })}>
                                        <option value="">None</option>
                                        {festivals.map(f => (
                                            <option key={f.id} value={f.name}>{f.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="checkbox"
                                        id="isOffer"
                                        checked={formData.isOffer || false}
                                        onChange={e => setFormData({ ...formData, isOffer: e.target.checked })}
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                    <label htmlFor="isOffer" style={{ marginBottom: 0, cursor: 'pointer' }}>Mark as Offer</label>
                                </div>
                                <div className="form-group">
                                    <label>Price (৳)</label>
                                    <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                                {formData.isOffer && (
                                    <div className="form-group">
                                        <label>Offer Price (৳)</label>
                                        <input type="number" value={formData.offerPrice} onChange={e => setFormData({ ...formData, offerPrice: e.target.value })} required />
                                    </div>
                                )}

                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="checkbox"
                                        id="isHidden"
                                        checked={formData.isHidden || false}
                                        onChange={e => setFormData({ ...formData, isHidden: e.target.checked })}
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                    <label htmlFor="isHidden" style={{ marginBottom: 0, cursor: 'pointer', color: '#666' }}>Hide from Shop</label>
                                </div>

                                <div className="form-group full-width">
                                    <label>Display Image</label>
                                    <div className="image-upload-box">
                                        {formData.image ? (
                                            <div className="preview-container main-preview">
                                                <img src={formData.image} alt="Main" />
                                                <button type="button" className="btn-remove-img" onClick={() => setFormData({ ...formData, image: '' })}>
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="upload-btn">
                                                <Plus size={24} />
                                                <span>Add Display Image</span>
                                                <input type="file" accept="image/*" onChange={handleMainImageUpload} hidden />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Gallery Images</label>
                                    <div className="gallery-grid">
                                        {formData.images && formData.images.map((img, idx) => (
                                            <div key={idx} className="gallery-thumb">
                                                <img src={img} alt={`Gallery ${idx}`} />
                                                <button type="button" className="btn-remove-thumb" onClick={() => removeGalleryImage(idx)}>
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="upload-btn gallery-add">
                                            <Plus size={24} />
                                            <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} hidden />
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
                                </div>

                                {/* Inventory Manager */}
                                <div className="full-width inventory-section">
                                    <h4>Inventory (Color / Size / Qty)</h4>
                                    <div className="inventory-row">
                                        <input
                                            placeholder="Color (e.g. Gold)"
                                            value={invColor}
                                            onChange={e => setInvColor(e.target.value)}
                                        />
                                        <input
                                            placeholder="Size (S,M,L)"
                                            value={invSize}
                                            onChange={e => setInvSize(e.target.value)}
                                            className="inv-input-sm"
                                        />
                                        <input
                                            placeholder="Qty"
                                            type="number"
                                            value={invQty}
                                            onChange={e => setInvQty(e.target.value)}
                                            className="inv-input-sm"
                                        />
                                        <button type="button" className="btn btn-primary" onClick={addInventoryItem}>Add</button>
                                    </div>

                                    <div style={{ marginTop: '1rem' }}>
                                        {formData.inventory.map(inv => (
                                            <div key={inv.color} style={{ marginBottom: '0.5rem', background: 'white', padding: '0.5rem', borderRadius: '4px' }}>
                                                <strong>{inv.color}</strong>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                                                    {Object.entries(inv.sizes).map(([size, qty]) => (
                                                        <span key={size} style={{ background: '#eee', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span style={{ fontWeight: 'bold' }}>{size}:</span>
                                                            <input
                                                                type="number"
                                                                value={qty}
                                                                onChange={(e) => updateInventoryQuantity(inv.color, size, e.target.value)}
                                                                style={{ width: '50px', padding: '2px', border: '1px solid #ccc', borderRadius: '3px' }}
                                                            />
                                                            <X size={14} style={{ cursor: 'pointer', color: '#ff4444' }} onClick={() => removeInventoryItem(inv.color, size)} />
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary full-width" style={{ marginTop: '2rem' }}>
                                    <Save size={18} style={{ marginRight: '8px' }} /> Save Product
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Admin;
