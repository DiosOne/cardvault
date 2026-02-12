import {Component} from 'react';
import {notifyError} from '../utility/notifications';

/**
 * React error boundary to catch rendering errors and show fallback UI.
 */
export class ErrorBoundary extends Component {
  /**
   * Initialize error boundary state.
   * @param {object} props
   */
  constructor(props) {
    super(props);
    this.state= {hasError: false};
  }

  /**
   * Update state when a child throws during render.
   * @returns {{ hasError: boolean }}
   */
  static GetDerivedStateFromError() {
    return {hasError: true};
  }

  /**
   * Log errors and notify users when a render error is caught.
   * @param {Error} error
   * @param {import('react').ErrorInfo} info
   * @returns {void}
   */
  componentDidCatch(error, info) {
    console.error('Unexpected UI error:', error, info);
    notifyError(error);
  }

  /**
   * Reset the error state and call the optional reset callback.
   * @returns {void}
   */
  handleRetry= () => {
    this.setState({hasError: false});
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  /**
   * Render fallback UI when errors occur, otherwise render children.
   * @returns {JSX.Element|import('react').ReactNode}
   */
  render() {
    if (this.state.hasError) {
      return (
        <main className='error-boundary' role='alert'>
          <h2>Something went wrong...</h2>
          <p>Try refreshing the page, or returning home.</p>
          <button type='button' onClick={this.handleRetry}>
            Retry
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
