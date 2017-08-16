import React, {Component} from 'react';

function forAuth(WrappedComponent) {
  return class extends Component {
    render() {
      const props = this.props;
      const {isLogin, credential, ...rest} = props;
      const auth = {isLogin, credential};

      return props.isLogin ? <WrappedComponent {...rest} auth={auth}/> : null;
    }
  }
}

function logProps(WrappedComponent) {
  return class extends Component {
    componentWillReceiveProps(nextProps) {
      console.log('Prev Props', this.props);
      console.log('Next Props', nextProps);
    }

    render() {
      return (<WrappedComponent {...this.props}/>)
    }
  };
}

const ProtectedComponent = ({auth}) => (
  <h2>Protected Content: {auth.isLogin.toString()}</h2>
);

const EnhancedComponent = logProps(forAuth(ProtectedComponent));

class App extends Component {
  state = {
    isLogin: false,
    credential: {}
  };

  toggleLogin = () => {
    this.setState((prevState) => {
      const {isLogin} = prevState;
      if (isLogin) {
        return {
          isLogin: false, credential: {}
        }
      }
      return {
        isLogin: true,
        credential: {email: 'nut@hotmail.com', accessToken: 'token'}
      }
    })
  };

  render() {
    return (
      <div>
        <button onClick={this.toggleLogin}>Toggle</button>
        <EnhancedComponent {...this.state}/>
      </div>
    );
  }
}

export default App;
