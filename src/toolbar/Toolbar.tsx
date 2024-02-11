import React from 'react';
import { HTMLAttributes } from 'react';

export function Toolbar(props: HTMLAttributes<HTMLDivElement>) {
  return (<div className='wrapper'><div {...props} className="rsw-toolbar" /></div>);
}
