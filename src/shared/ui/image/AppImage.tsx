import React from 'react';
import { ImageProps, ImageStyle, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

export interface AppImageProps extends Omit<ImageProps, 'source'> {
    uri?: string;
    source?: ImageProps['source'];
    showLoader?: boolean;

    onLoadStart?: () => void;
    onLoadEnd?: () => void;

    fallbackSource?: ImageProps['source'];
    renderError?: () => React.ReactNode;

    width?: number;
    height?: number;
    borderRadius?: number;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

const Container = styled.View<{
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
}>`
  position: relative;
  overflow: hidden;
  width: ${({ width }) =>
        width ? (typeof width === 'number' ? `${width}px` : width) : '100%'};
  ${({ height }) =>
        height ? `height: ${typeof height === 'number' ? `${height}px` : height};` : ''};
  ${({ borderRadius }) => (borderRadius != null ? `border-radius: ${borderRadius}px;` : '')}
`;

const StyledImage = styled.Image<{
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
    borderRadius?: number;
}>`
  width: 100%;
  height: 100%;
  resize-mode: ${({ resizeMode }) => resizeMode || 'cover'};
  ${({ borderRadius }) => (borderRadius != null ? `border-radius: ${borderRadius}px;` : '')}
`;

const LoaderContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const ErrorContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  z-index: 2;
`;

const AppImage: React.FC<AppImageProps> = ({
    uri,
    source,
    style,
    showLoader = true,
    onLoadStart,
    onLoadEnd,
    onLoad,
    onError,
    fallbackSource,
    renderError,
    width,
    height,
    borderRadius,
    resizeMode = 'cover',
    ...rest
}) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);
    const [currentSource, setCurrentSource] = React.useState<ImageProps['source']>(
        source ?? (uri ? { uri } : undefined)
    );

    React.useEffect(() => {
        setCurrentSource(source ?? (uri ? { uri } : undefined));
        setIsLoading(true);
        setHasError(false);
    }, [uri, source]);

    const handleLoadStart = () => {
        setIsLoading(true);
        onLoadStart?.();
    };

    const handleLoad = (e: any) => {
        setIsLoading(false);
        setHasError(false);
        onLoad?.(e);
        onLoadEnd?.();
    };

    const handleError = (e: any) => {
        if (fallbackSource && currentSource !== fallbackSource) {
            setCurrentSource(fallbackSource);
            setIsLoading(true);
            setHasError(false);
            return;
        }
        setIsLoading(false);
        setHasError(true);
        onError?.(e);
        onLoadEnd?.();
    };

    const styleBorderRadius = (style as ImageStyle)?.borderRadius as number | undefined;
    const finalRadius = borderRadius ?? styleBorderRadius;

    return (
        <Container width={width} height={height} borderRadius={finalRadius} style={style}>
            {showLoader && isLoading && (
                <LoaderContainer>
                    <ActivityIndicator size="small" color="#000" />
                </LoaderContainer>
            )}

            {!hasError && currentSource && (
                <StyledImage
                    source={currentSource}
                    resizeMode={resizeMode}
                    borderRadius={finalRadius}
                    onLoadStart={handleLoadStart}
                    onLoad={handleLoad}
                    onError={handleError}
                    {...rest}
                />
            )}

            {hasError && !fallbackSource && renderError && (
                <ErrorContainer>{renderError()}</ErrorContainer>
            )}
        </Container>
    );
};

export default AppImage;
