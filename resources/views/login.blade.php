@extends('layout')

@section('title', 'Login page')

@section('content')
    <form action="" method="POST" class="form">
        @csrf
        <input type="email" name="email" placeholder="Email" value="{{ old('email') }}">
        <input type="password" name="password" placeholder="Password" value="{{ old('password') }}">
        <input type="submit" name="register" value="Login">
    </form>
    @include('errors')
@endsection