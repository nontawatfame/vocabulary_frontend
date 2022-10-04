export interface InitialFormState  {
    vocabulary: string;
    type: string;
    meaning: string;
    sound: any;
}

export interface InitialPagination  {
   page: number,
   size: number,
   total_pages: number
}

export interface Vocabulary {
    id: number;
    name: string;
    type_id: number;
    meaning: string;
    correct: number;
    incorrect: number;
    create_at: Date;
    updated_at: Date;
    sound: string;
    abbreviation: string;
}

export interface SettingForm  {
    correct: string;
    condition: string;
}
