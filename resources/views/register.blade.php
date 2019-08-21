@extends('layout')

@section('title', 'Registration page')

@section('content')
    <form action="" method="POST" class="form">
        @csrf
        <input type="text" name="displayName" placeholder="Nickname" value="{{ old('displayName') }}">
        <input type="email" name="email" placeholder="Email" value="{{ old('email') }}">
        <input type="password" name="password" placeholder="Password" value="{{ old('password') }}">
        <input type="submit" name="register" value="Register">
    </form>
    @include('errors')
@endsection