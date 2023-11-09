import React from 'react';

const EntityDataContext = React.createContext();
export function withEntityData(Component) {
  return function EntityDataComponent(props) {
    return (
      <EntityDataContext.Consumer>
        {contextValue => {
          const source = props?.source || contextValue?.source;
          const path = props?.path;
          const sourceValue = _.get(source, path);
          const value = props.value !== undefined ? props.value : sourceValue;
          const onChange = props?.onChange || contextValue?.onChange;
          return (
            <Component {...props} source={source} path={path} value={value} onChange={onChange} />
          );
        }}
      </EntityDataContext.Consumer>
    );
  };
}

export default class EntityData extends React.PureComponent {
  render() {
    return (
      <EntityDataContext.Provider
        value={{
          source: this.props.source,
          onChange: this.props.onChange,
        }}
      >
        {this.props.children}
      </EntityDataContext.Provider>
    );
  }
}
