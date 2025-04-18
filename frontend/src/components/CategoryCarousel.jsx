import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div>
            <Carousel loop className="w-full max-w-5xl mx-auto my-20 px-4">
                <CarouselContent className="flex items-center gap-4">
                    {category.map((cat, index) => (
                        <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 flex justify-center">
                            <Button
                                onClick={() => searchJobHandler(cat)}
                                variant="outline"
                                className="rounded-full inset-0 bg-[#12253a] bg-opacity-60 text-white border-[#6A38C2] hover:bg-[#6A38C2] hover:text-white transition-colors duration-300 px-6 py-3"
                            >
                                {cat}
                            </Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="bg-[#6A38C2] hover:bg-[#572fa1] text-white" />
                <CarouselNext className="bg-[#6A38C2] hover:bg-[#572fa1] text-white" />
            </Carousel>
        </div>

    )
}

export default CategoryCarousel