import React from "react";

/**
 * Global UI safety net.
 * Prevents an unexpected React render error from leaving the whole page blank.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled React runtime error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        role="alert"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#f8f9fa",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            padding: "32px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
          }}
        >
          <h2 style={{ marginBottom: "12px" }}>Something went wrong</h2>
          <p style={{ color: "#666", marginBottom: "24px" }}>
            An unexpected error occurred while loading this page. Please try
            again. If the problem continues, contact the website administrator.
          </p>

          <button
            type="button"
            onClick={this.handleReload}
            style={{
              border: 0,
              borderRadius: "6px",
              padding: "10px 20px",
              cursor: "pointer",
              background: "#0d6efd",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
