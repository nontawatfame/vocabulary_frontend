export interface LogType {
    user_id: number,
    correct_total: number,
    incorrect_total: number,
}

export interface logDetail {
    vocabulary_id: number,
    correct: number,
    incorrect: number
}


export interface LogData {
    id: number;
    user_id: number;
    correct_total: number;
    incorrect_total: number;
    create_at: Date;
    updated_at: Date;
}

export interface LogDetailData {
    id: number;
    log_id: number;
    vocabulary_id: number;
    correct: number;
    incorrect: number;
    create_at: Date;
    updated_at: Date;
    name: string;
    meaning: string;
    abbreviation: string;
}