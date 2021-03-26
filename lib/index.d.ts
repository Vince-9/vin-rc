import React from 'react';

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

export { Draw, DrawProps };
//# sourceMappingURL=index.d.ts.map
