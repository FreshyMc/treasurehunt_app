<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

use Kreait\Firebase\Exception\Auth\EmailNotFound;
use Kreait\Firebase\Exception\Auth\InvalidPassword;

class FirebaseController extends Controller
{
    public function index(Request $request){
        if($this->isLogged($request)){
            $database = $this->bootDatabase()->getDatabase();

            $users_reference = $database->getReference('users');

            $users = $users_reference->getValue();

            return view('firebase.home', compact('users'));
        }else{
            return redirect('/login');
        }
    }

    public function show_login(Request $request){
        if(!$this->isLogged($request)){
            return view('login');
        }else{
            return redirect('/home');
        }
    }

    public function show_register(Request $request){
        if(!$this->isLogged($request)){
            return view('register');
        }else{
            return redirect('/home');
        }
    }

    public function login(Request $login){
        $validatedData = $login->validate([
            'email' => 'required|email|max:100',
            'password' => 'required|min:8',
        ]);

        $firebase = $this->bootDatabase();

        $auth = $firebase->getAuth();

        try{
            $user = $auth->verifyPassword($login['email'], $login['password']);
        }catch(EmailNotFound $e){
            $customError = 'Email not found.';

            return view('login', compact('customError'));
        }catch(InvalidPassword $e){
            $customError = 'Invalid password.';

            return view('login', compact('customError'));
        }

        session(['uid'=>$user->uid, 'email'=>$user->email, 'name'=>$user->displayName]);

        return redirect('/home');
    }

    public function register(Request $registration){
        $validatedData = $registration->validate([
            'displayName' => 'required|min:3|max:100',
            'email' => 'required|email|max:100',
            'password' => 'required|min:8',
        ]);

        $firebase = $this->bootDatabase();

        $auth = $firebase->getAuth();

        $createdUser = $auth->createUser($validatedData);

        return redirect('/login');
    }

    private function bootDatabase(){
        $serviceAccount = ServiceAccount::fromJsonFile(__DIR__.'/treasurehunt.json');

        $firebase = (new Factory)
            ->withServiceAccount($serviceAccount)
            ->withDatabaseUri('https://treasurehunttest-21a49.firebaseio.com')
            ->create();

        return $firebase;
    }

    private function isLogged($request){
        if($request->session()->exists('uid')){
            return true;
        }else{
            return false;
        }
    }
}
