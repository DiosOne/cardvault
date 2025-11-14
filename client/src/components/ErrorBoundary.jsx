import {Component} from 'react';
import {notifyError} from '../utility/notifications';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state= {hasError: false};
  }

  static GetDerivedStateFromError() {
    return {hasError: true};
  }

  componentDidCatch(error, info) {
    console.error('Unexpected UI error:', error, info);
    notifyError(error);
  }

  handleRetry= () => {
    this.setState({hasError: false});
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

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