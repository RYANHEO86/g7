<?php

namespace Plugins\Offset\Support\Providers;

use Illuminate\Support\ServiceProvider;
use Plugins\Offset\Support\Repositories\Contracts\QuestionRepositoryInterface;
use Plugins\Offset\Support\Repositories\QuestionRepository;

class SupportServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            QuestionRepositoryInterface::class,
            QuestionRepository::class
        );
    }
}
