// src/components/Icon/SvgIcon.tsx
import React, { FC } from 'react';
import { SvgProps } from 'react-native-svg';
import styled from 'styled-components/native';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-native-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

// Import all SVG icons
import eyeIcon from '@assets/svg/eye.svg';
import eyeSlashedIcon from '@assets/svg/eye-sashed.svg';
import profile from '@assets/svg/profile-circle.svg';
import homeIcon from '@assets/svg/home.svg';
import ArrowLeftIcon from '@assets/svg/arrowLeft.svg';
import EmptyEllipseIcon from '@assets/svg/ellipse-vide.svg';
import EllipseIcon from '@assets/svg/ellipse.svg';
import AddPhotoIcon from '@assets/svg/add-photo.svg';
import SettingIcon from '@assets/svg/setting.svg';
import BureauIcon from '@assets/svg/bureau.svg';
import MaisonIcon from '@assets/svg/maison.svg';
import LocalisationIcon from '@assets/svg/localisation.svg';
import AppartementIcon from '@assets/svg/appartement.svg';
import HotelIcon from '@assets/svg/hotel.svg';
import PenIcon from '@assets/svg/pen.svg';
import LocationIcon from '@assets/svg/location.svg';
import LogoPro24Icon from '@assets/svg/logo-Pro24.svg';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';
import ListIcon from '@assets/svg/list.svg';
import MarkerProfIcon from '@assets/svg/marker-profs.svg';
import PdfIcon from '@assets/svg/pdf.svg';
import DeleteIcon from '@assets/svg/delete-stop-svg.svg';
import ImageIcon from '@assets/svg/image.svg';

// Import FontAwesome icons
import {
    faBuilding,
    faCamera,
    faCheck,
    faChevronRight,
    faEnvelopeOpenText,
    faIdCard,
    faInfo,
    faMapMarkedAlt,
    faQuestion,
    faTimes,
    faTimesCircle,
    faTrash,
    faUser,
    faHome as faHomeIcon,
    faList,
    faGrinHearts,
    faCog,
    faLayerGroup,
    faCrosshairs,
    faUserPlus,
    faMapMarkerAlt,
    faQuestionCircle,
    faFileInvoice,
    faEuroSign,
    faCreditCard,
    faLock,
    faCar,
    faPen as faPenIcon,
    faChevronCircleLeft,
    faFileAlt,
    faFileUpload,
    faUserClock,
    faChevronLeft,
    faUserCircle,
    faTag,
    faShield,
    faExclamationCircle,
    faFolderOpen,
    faChevronUp,
    faChevronDown
} from '@fortawesome/free-solid-svg-icons';

import { AppColor, Colors } from '@utils/constant';

// Define icon names as union type - include both SVG and FontAwesome icons
export type IconName =
    // SVG Icons
    | 'eye'
    | 'eye-slashed'
    | 'profile'
    | 'home'
    | 'arrow-left'
    | 'empty-ellipse'
    | 'ellipse'
    | 'add-photo'
    | 'settings'
    | 'bureau'
    | 'maison'
    | 'localisation'
    | 'appartement'
    | 'hotel'
    | 'pen'
    | 'location'
    | 'logo-pro24'
    | 'logo-medium-pro24'
    | 'list'
    | 'marker-prof'
    | 'pdf'
    | 'delete'
    | 'image'
    // FontAwesome Icons
    | 'fa-building'
    | 'fa-camera'
    | 'fa-check'
    | 'fa-chevron-right'
    | 'fa-envelope-open-text'
    | 'fa-id-card'
    | 'fa-info'
    | 'fa-map-marked-alt'
    | 'fa-question'
    | 'fa-times'
    | 'fa-times-circle'
    | 'fa-trash'
    | 'fa-user'
    | 'fa-home'
    | 'fa-list'
    | 'fa-grin-hearts'
    | 'fa-cog'
    | 'fa-layer-group'
    | 'fa-crosshairs'
    | 'fa-user-plus'
    | 'fa-map-marker-alt'
    | 'fa-question-circle'
    | 'fa-file-invoice'
    | 'fa-euro-sign'
    | 'fa-credit-card'
    | 'fa-lock'
    | 'fa-car'
    | 'fa-pen'
    | 'fa-chevron-circle-left'
    | 'fa-file-alt'
    | 'fa-file-upload'
    | 'fa-user-clock'
    | 'fa-chevron-left'
    | 'fa-user-circle'
    | 'fa-tag'
    | 'fa-shield'
    | 'fa-exclamation-circle'
    | 'fa-folder-open'
    | 'fa-chevron-up'
    | 'fa-chevron-down';

export interface SvgIconProps {
    name: IconName;
    size?: number;
    color?: AppColor | string;
    strokeWidth?: number;
    style?: any;
    testID?: string;
}

// Map SVG icon names to components
const svgIconMap: Record<string, React.FC<SvgProps>> = {
    'eye': eyeIcon,
    'eye-slashed': eyeSlashedIcon,
    'profile': profile,
    'home': homeIcon,
    'arrow-left': ArrowLeftIcon,
    'empty-ellipse': EmptyEllipseIcon,
    'ellipse': EllipseIcon,
    'add-photo': AddPhotoIcon,
    'settings': SettingIcon,
    'bureau': BureauIcon,
    'maison': MaisonIcon,
    'localisation': LocalisationIcon,
    'appartement': AppartementIcon,
    'hotel': HotelIcon,
    'pen': PenIcon,
    'location': LocationIcon,
    'logo-pro24': LogoPro24Icon,
    'logo-medium-pro24': LogoMediumPro24Icon,
    'list': ListIcon,
    'marker-prof': MarkerProfIcon,
    'pdf': PdfIcon,
    'delete': DeleteIcon,
    'image': ImageIcon,
};

// Map FontAwesome icon names to components
const faIconMap: Record<string, IconDefinition> = {
    'fa-building': faBuilding,
    'fa-camera': faCamera,
    'fa-check': faCheck,
    'fa-chevron-right': faChevronRight,
    'fa-envelope-open-text': faEnvelopeOpenText,
    'fa-id-card': faIdCard,
    'fa-info': faInfo,
    'fa-map-marked-alt': faMapMarkedAlt,
    'fa-question': faQuestion,
    'fa-times': faTimes,
    'fa-times-circle': faTimesCircle,
    'fa-trash': faTrash,
    'fa-user': faUser,
    'fa-home': faHomeIcon,
    'fa-list': faList,
    'fa-grin-hearts': faGrinHearts,
    'fa-cog': faCog,
    'fa-layer-group': faLayerGroup,
    'fa-crosshairs': faCrosshairs,
    'fa-user-plus': faUserPlus,
    'fa-map-marker-alt': faMapMarkerAlt,
    'fa-question-circle': faQuestionCircle,
    'fa-file-invoice': faFileInvoice,
    'fa-euro-sign': faEuroSign,
    'fa-credit-card': faCreditCard,
    'fa-lock': faLock,
    'fa-car': faCar,
    'fa-pen': faPenIcon,
    'fa-chevron-circle-left': faChevronCircleLeft,
    'fa-file-alt': faFileAlt,
    'fa-file-upload': faFileUpload,
    'fa-user-clock': faUserClock,
    'fa-chevron-left': faChevronLeft,
    'fa-user-circle': faUserCircle,
    'fa-tag': faTag,
    'fa-shield': faShield,
    'fa-exclamation-circle': faExclamationCircle,
    'fa-folder-open': faFolderOpen,
    'fa-chevron-up': faChevronUp,
    'fa-chevron-down': faChevronDown,
};

const SvgIcon: FC<SvgIconProps> = ({
    name,
    size = 24,
    color = 'black',
    strokeWidth = 1.5,
    style,
    testID,
    ...rest
}) => {
    const finalColor = color in Colors ? Colors[color as keyof typeof Colors] : color;

    // Check if it's a FontAwesome icon
    const faIcon = faIconMap[name];
    if (faIcon) {
        return (
            <IconContainer size={size} style={style} testID={testID}>
                <FaIcon
                    icon={faIcon as any}
                    size={size}
                    color={finalColor}
                />
            </IconContainer>
        );
    }

    // Check if it's an SVG icon
    const IconComponent = svgIconMap[name];
    if (IconComponent) {
        return (
            <IconContainer size={size} style={style} testID={testID}>
                <IconComponent
                    width={size}
                    height={size}
                    fill={finalColor}
                    stroke={finalColor}
                    strokeWidth={strokeWidth}
                    {...rest as SvgProps}
                />
            </IconContainer>
        );
    }

    console.warn(`Icon "${name}" not found`);
    return null;
};

const IconContainer = styled.View<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  justify-content: center;
  align-items: center;
`;

// Helper function to add new icons at runtime
export const registerSvgIcon = (name: string, component: React.FC<SvgProps>) => {
    svgIconMap[name] = component;
};

export const registerFontAwesomeIcon = (name: string, icon: IconDefinition) => {
    faIconMap[name] = icon;
};

export default SvgIcon;