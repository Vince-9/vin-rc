import * as React from 'react';

interface DrawProps {
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    visiable?: boolean;
    onClose?: () => void;
    minHeight?: number;
    maxHeight?: number;
}
declare function Draw(props: DrawProps): JSX.Element;

declare function test(): JSX.Element;

export { Draw, DrawProps, test as Test };
//# sourceMappingURL=index.d.ts.map
