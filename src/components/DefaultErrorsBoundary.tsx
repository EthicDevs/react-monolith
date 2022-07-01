import React, { Component, ErrorInfo, ReactNode } from "react";

export interface ErrorsBoundaryProps {
  children: ReactNode;
}

export interface ErrorsBoundaryState {
  hasError: boolean;
  error: null | Error;
}

export default class DefaultErrorsBoundary extends Component<
  ErrorsBoundaryProps,
  ErrorsBoundaryState
> {
  public state: ErrorsBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorsBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: error != null, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Sorry.. there was an error.</h1>
          {this.state.error != null && (
            <>
              <label>{this.state.error.name}</label>
              <p>{this.state.error.message}</p>
              <pre>
                <code>{this.state.error.stack}</code>
              </pre>
            </>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
