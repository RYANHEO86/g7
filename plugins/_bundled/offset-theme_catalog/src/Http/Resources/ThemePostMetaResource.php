<?php

namespace Plugins\Offset\ThemeCatalog\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ThemePostMetaResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'post_id' => $this->post_id,
            'builder' => $this->builder ?? 'rebuilder',
            'price' => $this->price,
            'license' => $this->license,
            'description_short' => $this->description_short,
            'description_long' => $this->description_long,
            'features' => $this->features ?? [],
            'changelog' => $this->changelog,
            'demo_url' => $this->demo_url,
            'purchase_url' => $this->purchase_url,
            'download_count' => $this->download_count,
            'last_update' => $this->last_update,
            'install_note' => $this->install_note,
            'min_requirement' => $this->min_requirement,
            'rating' => $this->rating,
            'review_count' => $this->review_count,
        ];
    }
}
