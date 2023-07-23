import React from 'react';
import '../styles/TitleImage.css';

interface TitleImageProps {
    src: string;
    alt: string;
}

const TitleImage: React.FC<TitleImageProps> = ({src, alt}) => {
    return (
            <img
                src={src}
                alt={alt}
                className="title-image"
            />
    );
}

export default TitleImage;
