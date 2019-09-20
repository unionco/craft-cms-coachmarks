<?php

namespace unionco\coachmarks\models;

interface ApiTransformable
{
    public static function apiTransform($data): array;
}
