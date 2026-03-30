import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompare } from '../context/CompareContext';

const ComparisonModal = ({ isOpen, onClose }) => {
  const { compareList, removeFromCompare } = useCompare();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="compare-modal glass-premium"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Compare Apartments</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="compare-table-wrapper">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Features</th>
                {compareList.map(item => (
                  <th key={item.id}>
                    <div className="compare-item-header">
                      <div className="mini-apt-img" style={{ backgroundImage: `url(${item.image})` }}></div>
                      <span>{item.title}</span>
                      <button className="remove-item" onClick={() => removeFromCompare(item.id)}>Remove</button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="feat-name">Price</td>
                {compareList.map(item => <td key={item.id} className="feat-val highlight">{item.price}</td>)}
              </tr>
              <tr>
                <td className="feat-name">Size</td>
                {compareList.map(item => <td key={item.id} className="feat-val">{item.size}</td>)}
              </tr>
              <tr>
                <td className="feat-name">Bedrooms</td>
                {compareList.map(item => <td key={item.id} className="feat-val">{item.bedrooms} BHK</td>)}
              </tr>
              <tr>
                <td className="feat-name">Location</td>
                {compareList.map(item => <td key={item.id} className="feat-val">Dhaka</td>)}
              </tr>
            </tbody>
          </table>
        </div>
        
        {compareList.length < 2 && (
          <p className="compare-warning">Add at least 2 apartments to compare.</p>
        )}
      </motion.div>
    </div>
  );
};

export default ComparisonModal;
