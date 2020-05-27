import React from 'react';
import { InlineFormLabel } from '@grafana/ui';
import { FunctionDescriptor } from './FunctionEditorControls';
import { FunctionElem } from './FunctionElem';

interface FunctionsProps {
  funcs: FunctionDescriptor[];
  onChange: (func: FunctionDescriptor[]) => void;
  onRunQuery: () => void;
}

const arrayMove = (array: any[], from: number, to: number): any[] => {
  const newArray = [...array];
  const moveElem = newArray.splice(from, 1)[0];
  newArray.splice(to, 0, moveElem);

  return newArray;
};

class Functions extends React.PureComponent<FunctionsProps> {
  constructor(props: FunctionsProps) {
    super(props);
  }

  handleRemoveFunction = (func: FunctionDescriptor, index: number) => {
    const { onChange, onRunQuery } = this.props;
    const newFuncs = [...this.props.funcs];
    newFuncs.splice(index, 1);
    onChange(newFuncs);
    onRunQuery();
  };

  handleMoveLeft = (func: FunctionDescriptor, index: number) => {
    if (index < 1) {
      return;
    }

    const { onChange, onRunQuery } = this.props;
    const newFuncs = arrayMove(this.props.funcs, index, index - 1);
    onChange(newFuncs);
    onRunQuery();
  };

  handleMoveRight = (func: FunctionDescriptor, index: number) => {
    if (index >= this.props.funcs.length - 1) {
      return;
    }

    const { onChange, onRunQuery } = this.props;
    const newFuncs = arrayMove(this.props.funcs, index, index + 1);
    onChange(newFuncs);
    onRunQuery();
  };

  onFuncChange = (func: FunctionDescriptor, index: number) => {
    const { onChange } = this.props;
    const newFuncs = [...this.props.funcs];
    newFuncs.splice(index, 1, func);
    onChange(newFuncs);
  };

  render() {
    const { funcs, onRunQuery } = this.props;
    return (
      <div className="gf-form-inline">
        <div className="gf-form">
          <InlineFormLabel width={6} className="query-keyword">
            Functions
          </InlineFormLabel>
        </div>
        {funcs &&
          funcs.map((func, index) => (
            <FunctionElem
              key={index}
              index={index}
              func={func}
              onMoveLeft={this.handleMoveLeft}
              onMoveRight={this.handleMoveRight}
              onRemove={this.handleRemoveFunction}
              onChange={this.onFuncChange}
              onRunQuery={onRunQuery}
            />
          ))}
        <div className="gf-form gf-form--grow">
          <div className="gf-form-label gf-form-label--grow"></div>
        </div>
      </div>
    );
  }
}

export { Functions };