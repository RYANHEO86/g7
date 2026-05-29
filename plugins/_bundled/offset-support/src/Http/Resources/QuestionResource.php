<?php

namespace Plugins\Offset\Support\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'category' => $this->category,
            'is_secret' => (bool) $this->is_secret,
            'status' => $this->status,
            'comment_count' => $this->comment_count ?? 0,
            'created_at' => optional($this->created_at)->toDateString(),
            'href' => '/board/qna/' . $this->id,
        ];
    }
}
