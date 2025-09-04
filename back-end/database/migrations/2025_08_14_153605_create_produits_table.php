<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->double('prix');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('path');
            $table->enum('type',['tacos','pizza','the','caffe','boisson','autre']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            $table->dropSoftDeletes(); // This removes the deleted_at column
        });
        Schema::dropIfExists('produits');
    }
};
