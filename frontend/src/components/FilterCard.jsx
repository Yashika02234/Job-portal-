import React from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

const filterData = [
  {
    filterType: 'Location',
    array: ['Delhi NCR', 'Bangalore', 'Pune', 'Mumbai']
  },
  {
    filterType: 'Industry',
    array: ['Front Developer', 'Backend Developer', 'FullStack Developer']
  },
  {
    filterType: 'Salary',
    array: ['0-40K', '42K-1Lakh', '1Lakh-5Lakh']
  }
];

const FilterCard = () => {
  return (
    <div className='w-full bg-white p-3 rounded-md'>
      <h1 className='font-bold text-lg'>Filter Jobs</h1>
      <hr className="mt-3" />
      {filterData.map((data, index) => (
        <div key={index}>
          <h1 className="font-bold text-lg">{data.filterType}</h1>
          <RadioGroup>
            {data.array.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2 my-2">
                <RadioGroupItem id={item} value={item} />
                <Label htmlFor={item}>{item}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};

export default FilterCard;
