import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TitleImage.css';
import { CSSProperties } from 'styled-components';

interface TitleImageProps {
    src: string;
    alt: string;
    style?: CSSProperties;
}

const TitleImage: React.FC<TitleImageProps> = ({src, alt, style}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    }

    return (
            <img
                src={src}
                alt={alt}
                className="title-image"
                onClick={handleClick}
                style={style}
            />
    );
}

export default TitleImage;
