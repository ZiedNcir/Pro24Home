import React from 'react';
import {
    ImageProps,
    ImageStyle,
    ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';

//const AnimatedSkeleton = require('react-native-animated-skeleton').default;

export interface AppImageProps extends Omit<ImageProps, 'source'> {
    uri?: string;
    source?: ImageProps['source'];
    // Loading states
    showSkeleton?: boolean;
    showLoader?: boolean;
    // Customization
    skeletonType?: 'shimmer' | 'pulse' | 'wave';
    skeletonColors?: [string, string]; // [baseColor, highlightColor]
    // Callbacks
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
    // Error state
    fallbackSource?: ImageProps['source'];
    renderError?: () => React.ReactNode;
    // Performance
    progressiveRenderingEnabled?: boolean;
    // Styled-components props
    width?: number;
    height?: number;
    borderRadius?: number;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

// Styled Components
const Container = styled.View<{
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
}>`
    position: relative;
    overflow: hidden;
    ${({ width }) => width && `width: ${typeof width === 'number' ? `${width}px` : width};`}
    ${({ height }) => height && `height: ${typeof height === 'number' ? `${height}px` : height};`}
    ${({ borderRadius }) => borderRadius && `border-radius: ${borderRadius}px;`}
`;

const StyledImage = styled.Image<{
    opacity?: number;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
    borderRadius?: number;
}>`
    width: 100%;
    height: 100%;
    resize-mode: ${({ resizeMode }) => resizeMode || 'cover'};
    ${({ opacity }) => opacity !== undefined && `opacity: ${opacity};`}
    ${({ borderRadius }) => borderRadius && `border-radius: ${borderRadius}px;`}
`;

const SkeletonWrapper = styled.View`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
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
    background-color: transparent;
`;

const ErrorContainer = styled.View`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: center;
    align-items: center;
    background-color: '#f5f5f5';
    z-index: 2;
`;
//FixMe add theme 
// background-color: ${({ theme }) => theme?.colors?.background || '#f5f5f5'}; 
const AppImage: React.FC<AppImageProps> = ({
    uri,
    source,
    style,
    showSkeleton = true,
    showLoader = false,
    skeletonType = 'shimmer',
    skeletonColors = ['#E1E9EE', '#F2F8FC'],
    onLoadStart,
    onLoadEnd,
    onLoad,
    onError,
    fallbackSource,
    renderError,
    progressiveRenderingEnabled = false,
    width,
    height,
    borderRadius,
    resizeMode = 'cover',
    ...rest
}) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);
    const [currentSource, setCurrentSource] = React.useState(source || { uri });

    React.useEffect(() => {
        setCurrentSource(source || { uri });
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
        setIsLoading(false);
        setHasError(true);

        if (fallbackSource) {
            setCurrentSource(fallbackSource);
            setIsLoading(true);
        }

        onError?.(e);
        onLoadEnd?.();
    };

    const getSkeletonAnimation = () => {
        switch (skeletonType) {
            case 'pulse':
                return { type: 'pulse' as const, duration: 1000 };
            case 'wave':
                return { type: 'shimmer' as const, duration: 1500, direction: 'right' };
            default:
                return { type: 'shimmer' as const, duration: 1000 };
        }
    };

    //const skeletonAnimation = getSkeletonAnimation();

    // Extract border radius from style prop if provided
    const styleBorderRadius = (style as ImageStyle)?.borderRadius as number | undefined;

    return (
        <Container
            width={width}
            height={height}
            borderRadius={borderRadius || styleBorderRadius}
            style={style}
        >


            {/* Activity Indicator */}
            {showLoader && isLoading && !showSkeleton && (
                <LoaderContainer>
                    <ActivityIndicator size="small" color="#000" />
                </LoaderContainer>
            )}

            {/* Image */}
            {currentSource && (
                <StyledImage
                    source={currentSource}
                    opacity={isLoading ? 0 : 1}
                    resizeMode={resizeMode}
                    borderRadius={borderRadius || styleBorderRadius}
                    onLoadStart={handleLoadStart}
                    onLoad={handleLoad}
                    onError={handleError}
                    progressiveRenderingEnabled={progressiveRenderingEnabled}
                    {...rest}
                />
            )}

            {/* Error State */}
            {hasError && !fallbackSource && renderError && (
                <ErrorContainer>
                    {renderError()}
                </ErrorContainer>
            )}
        </Container>
    );
};

export default AppImage;