const LoadingSpinner = ({ size = 'md', text = '' }) => {
  return (
    <div className={`loading-spinner-wrapper ${size}`}>
      <div className="loading-spinner" />
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
