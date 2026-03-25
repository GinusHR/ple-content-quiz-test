<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/questions', function () {
    return response()->json([
        'question'=> "yeah ts works"
    ]);
});

Route::post('/quiz-result', function (Request $request) {
    $answers = $request->answers;

    $scores=[];

    foreach($answers as $answer) {
        foreach($answer as $faction => $points) {
            if(!isset($scores[$faction])) {
                $scores[$faction] = 0;
            }
            $scores[$faction] += $points;
        }
    };

    arsort($scores);

    $result = array_key_first($scores);


    return response()->json([
        'faction'=> $result,
        'score'=> $scores
    ]) ;
});

// Route::post('/questions', function () {
    

// });
