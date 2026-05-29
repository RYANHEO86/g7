<?php

namespace Plugins\Offset\ThemeCatalog\Models;

use Illuminate\Database\Eloquent\Model;

class ThemePostMeta extends Model
{
    protected $table = 'theme_post_metas';

    protected $fillable = [
        'post_id', 'price', 'license', 'description_short', 'description_long',
        'features', 'changelog', 'demo_url', 'purchase_url', 'download_count',
        'last_update', 'install_note', 'min_requirement', 'rating', 'review_count',
    ];

    protected $casts = [
        'features' => 'array',
        'changelog' => 'array',
        'download_count' => 'integer',
        'review_count' => 'integer',
    ];
}
